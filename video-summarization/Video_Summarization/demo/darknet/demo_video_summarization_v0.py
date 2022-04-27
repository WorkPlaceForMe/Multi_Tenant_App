'''
$ python demo_video_summarization.py --input /media/grayamtics/backup2/yunting/Algorithm/Smart_City/testing_videos/Bridgeway_Mar2021.mp4
$ python demo_video_summarization.py --input /media/grayamtics/backup2/yunting/Algorithm/Smart_City/testing_videos/vehicle/globeoss.mp4
'''

from ctypes import *
import random
import os
import cv2
import time
import darknet
import argparse
from queue import Queue
from threading import Thread
import multiprocessing
import numpy as np


def parser():
    parser = argparse.ArgumentParser(description="YOLO Object Detection")
    parser.add_argument("--input", type=str, default=0,
                        help="video source. If empty, uses webcam 0 stream")
    parser.add_argument("--out_filename", type=str, default="",
                        help="inference video name. Not saved if empty")
    parser.add_argument("--weights", default="yolov4.weights",
                        help="yolo weights path")
    parser.add_argument("--dont_show", action='store_true',
                        help="windown inference display. For headless systems")
    parser.add_argument("--ext_output", action='store_true',
                        help="display bbox coordinates of detected objects")
    parser.add_argument("--config_file", default="./cfg/yolov4.cfg",
                        help="path to config file")
    parser.add_argument("--data_file", default="./cfg/coco.data",
                        help="path to data file")
    parser.add_argument("--thresh", type=float, default=.25,
                        help="remove detections with confidence below this value")
    return parser.parse_args()


def str2int(video_path):
    """
    argparse returns and string althout webcam uses int (0, 1 ...)
    Cast to int if needed
    """
    try:
        return int(video_path)
    except ValueError:
        return video_path


def check_arguments_errors(args):
    assert 0 < args.thresh < 1, "Threshold should be a float between zero and one (non-inclusive)"
    if not os.path.exists(args.config_file):
        raise(ValueError("Invalid config path {}".format(os.path.abspath(args.config_file))))
    if not os.path.exists(args.weights):
        raise(ValueError("Invalid weight path {}".format(os.path.abspath(args.weights))))
    if not os.path.exists(args.data_file):
        raise(ValueError("Invalid data file path {}".format(os.path.abspath(args.data_file))))
    if str2int(args.input) == str and not os.path.exists(args.input):
        raise(ValueError("Invalid video path {}".format(os.path.abspath(args.input))))


def set_saved_video(input_video, output_video, size):
    fourcc = cv2.VideoWriter_fourcc(*"MJPG") #'XVID' for smaller size output video
    fps = int(input_video.get(cv2.CAP_PROP_FPS)) # hardcode the fps of output video
    video = cv2.VideoWriter(output_video, fourcc, fps, size)
    return video


def convert2relative(bbox):
    """
    YOLO format use relative coordinates for annotation
    """
    x, y, w, h  = bbox
    _height     = darknet_height
    _width      = darknet_width
    return x/_width, y/_height, w/_width, h/_height


def convert2original(image, bbox):
    x, y, w, h = convert2relative(bbox)

    image_h, image_w, __ = image.shape

    orig_x       = int(x * image_w)
    orig_y       = int(y * image_h)
    orig_width   = int(w * image_w)
    orig_height  = int(h * image_h)

    bbox_converted = (orig_x, orig_y, orig_width, orig_height)

    return bbox_converted


def convert4cropping(image, bbox):
    x, y, w, h = convert2relative(bbox)

    image_h, image_w, __ = image.shape

    orig_left    = int((x - w / 2.) * image_w)
    orig_right   = int((x + w / 2.) * image_w)
    orig_top     = int((y - h / 2.) * image_h)
    orig_bottom  = int((y + h / 2.) * image_h)

    if (orig_left < 0): orig_left = 0
    if (orig_right > image_w - 1): orig_right = image_w - 1
    if (orig_top < 0): orig_top = 0
    if (orig_bottom > image_h - 1): orig_bottom = image_h - 1

    bbox_cropping = (orig_left, orig_top, orig_right, orig_bottom)

    return bbox_cropping


def yolo(filter_, frame_id, buffer_size, buffer_queue, overlay_queue):
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_id = frame_id + 1
        if frame_id > buffer_size:
            break
        frame = cv2.resize(frame, (1280, 720))
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_resized = cv2.resize(frame_rgb, (darknet_width, darknet_height), interpolation=cv2.INTER_LINEAR)
        img_for_detect = darknet.make_image(darknet_width, darknet_height, 3)
        darknet.copy_image_from_bytes(img_for_detect, frame_resized.tobytes())
        darknet_image = img_for_detect
        prev_time = time.time()
        detections = darknet.detect_image(network, class_names, darknet_image, thresh=args.thresh)
        detection_filtered = []
        for detection in detections: # label, confidence, bbox
            if detection[0] in filter_:
                detection_filtered.append(detection)
        fps = int(1/(time.time() - prev_time))
        # print("FPS: {}".format(fps))
        darknet.free_image(darknet_image)
        detections_adjusted = []
        if frame is not None:
            mask = np.zeros((720, 1280), dtype=np.uint8) # opposite of opencv
            for label, confidence, bbox in detection_filtered:
                bbox_adjusted = convert2original(frame, bbox)
                detections_adjusted.append((str(label), confidence, bbox_adjusted))
                left, top, right, bottom = darknet.bbox2points(bbox_adjusted)
                cv2.rectangle(mask, (left,top), (right, bottom), 255, -1)
                cv2.putText(mask, "{}".format(frame_id), (int((left+right)/2), int((top+bottom)/2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 255, 2)
            overlay = np.zeros((720, 1280, 4), dtype=np.uint8)
            overlay[:,:,0:3] = frame
            overlay[:, :, 3] = mask
            for label, confidence, bbox in detections_adjusted:
                left, top, right, bottom = darknet.bbox2points(bbox)
                cv2.putText(overlay, "{}".format(frame_id), (int((left+right)/2), int((top+bottom)/2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0, 255), 2)
            
            buffer_queue.append(frame)
            overlay_queue.append(overlay)

            if not args.dont_show:
                cv2.imshow('Inference', frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
    cap.release()


def yolo_multiprocess(filter_, frame_id, start_frame, input_path, buffer_queue, overlay_queue):
    frame_id = 0
    while cap_subprocess.isOpened():
        ret, frame = cap_subprocess.read()
        if not ret:
            break
        frame_id = frame_id + 1
        if frame_id > buffer_size:
            break
        frame = cv2.resize(frame, (1280, 720))
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_resized = cv2.resize(frame_rgb, (darknet_width, darknet_height), interpolation=cv2.INTER_LINEAR)
        img_for_detect = darknet.make_image(darknet_width, darknet_height, 3)
        darknet.copy_image_from_bytes(img_for_detect, frame_resized.tobytes())
        darknet_image = img_for_detect
        prev_time = time.time()
        detections = darknet.detect_image(network, class_names, darknet_image, thresh=args.thresh)
        detection_filtered = []
        for detection in detections: # label, confidence, bbox
            if detection[0] in filter_:
                detection_filtered.append(detection)
        fps = int(1/(time.time() - prev_time))
        # print("FPS: {}".format(fps))
        darknet.free_image(darknet_image)
        detections_adjusted = []
        if frame is not None:
            mask = np.zeros((720, 1280), dtype=np.uint8) # opposite of opencv
            for label, confidence, bbox in detection_filtered:
                bbox_adjusted = convert2original(frame, bbox)
                detections_adjusted.append((str(label), confidence, bbox_adjusted))
                left, top, right, bottom = darknet.bbox2points(bbox_adjusted)
                cv2.rectangle(mask, (left,top), (right, bottom), 255, -1)
                cv2.putText(mask, "{}".format(start_frame+frame_id), (int((left+right)/2), int((top+bottom)/2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 255, 2)
            overlay = np.zeros((720, 1280, 4), dtype=np.uint8)
            overlay[:,:,0:3] = frame
            overlay[:, :, 3] = mask
            for label, confidence, bbox in detections_adjusted:
                left, top, right, bottom = darknet.bbox2points(bbox)
                cv2.putText(overlay, "{}".format(start_frame+frame_id), (int((left+right)/2), int((top+bottom)/2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0, 255), 2)

            alpha = 0.5
            blend = np.zeros((720, 1280, 4), dtype=np.uint8)
            blend[:,:,0:3] = (alpha * overlay[:,:,0:3]) + ((1-alpha) * overlay_queue[frame_id-1][:,:,0:3]) #BGR channels
            blend[:, :, 3] = overlay[:, :, 3] + overlay_queue[frame_id-1][:, :, 3] #Alpha channels

            # cv2.imwrite("outputA.png", overlay)
            # cv2.imwrite("outputB.png", overlay_queue[frame_id-1])
            # cv2.imwrite("outputAB.png", blend)
            overlay_queue[frame_id-1] = blend
            if not args.dont_show:
                cv2.imshow('Inference', frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
    cap.release()


if __name__ == '__main__':
    args = parser()
    check_arguments_errors(args)
    network, class_names, class_colors = darknet.load_network(
            args.config_file,
            args.data_file,
            args.weights,
            batch_size=1
        )

    darknet_width = darknet.network_width(network)
    darknet_height = darknet.network_height(network)

    input_path = str2int(args.input)
    cap = cv2.VideoCapture(input_path)
    video_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    video_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    video_length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print("video_length", video_length)
    if video_length < 900:
        raise ValueError('The length of video is less than 30s. Please upload again.')

    filter_ = ['car']#['person', 'car']

    buffer_size = 900 # for e.g. 9000 output frames = 300 buffer frames @ 30 fps (only process every 30th)
    fps_skipping_rate = 30

    number_of_processes = int(video_length/buffer_size)
    print("number_of_processes", number_of_processes)

    buffer_queue = []
    overlay_queue = []
    output_queue = []

    frame_id = 0
    cap.set(cv2.CAP_PROP_POS_FRAMES, 50)
    yolo(filter_, frame_id, buffer_size, buffer_queue, overlay_queue)
    # print(len(buffer_queue))
    # print(len(overlay_queue))   

    for i in range(1, number_of_processes+1):
        start_frame = buffer_size*i
        cap_subprocess = cv2.VideoCapture(input_path)
        cap_subprocess.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
        yolo_multiprocess(filter_, frame_id, start_frame, input_path, buffer_queue, overlay_queue)
        progress = str(i/number_of_processes)
        print("progress", progress, " - ", start_frame)

    for idx in range(0, buffer_size):
        background = buffer_queue[idx]
        background = cv2.cvtColor(background, cv2.COLOR_BGR2BGRA)
        background[:, :, 3] = 255

        overlay = overlay_queue[idx]

        # cv2.imwrite("output_overlay.png", overlay)
        # cv2.imwrite("output_background.png", background)

        background=cv2.addWeighted(background,0.2,overlay,0.8,0)
        background = cv2.cvtColor(background, cv2.COLOR_BGRA2BGR)

        output_queue.append(background)

        # cv2.imwrite("output_background_overlayed.png", background)

    save = True
    if save == True:
        fourcc = cv2.VideoWriter_fourcc(*'MP4V')
        out = cv2.VideoWriter('output.mp4',fourcc, 60.0, (1280,720))
        for image in output_queue:
            out.write(image)
        out.release()
        