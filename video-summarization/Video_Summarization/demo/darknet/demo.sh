#!/bin/bash

helpFunction()
{
   echo ""
   echo "Usage: $0 -i inputFileName -o outputFileName -s startTime -e endTime -d duration"
   echo -e "\t-i Input video file name"
   echo -e "\t-o Output video file name"
   echo -e "\t-s Video start time"
   echo -e "\t-e Video end time"
   echo -e "\t-d Summarized video duration"
   exit 1 # Exit script after printing help
}

while getopts "i:o:s:e:d:" opt
do
   case "$opt" in
      i ) inputFileName="$OPTARG" ;;
      o ) outputFileName="$OPTARG" ;;
      s ) startTime="$OPTARG" ;;
      e ) endTime="$OPTARG" ;;
      d ) duration="$OPTARG" ;;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

rm -f $outputFileName

ffmpeg -i $inputFileName -ss $startTime -to $endTime -c copy input_trimmed.mp4 -y

python3 demo_video_summarization.py --input input_trimmed.mp4 --out_filename output.mp4 --duration $duration --dont_show

ffmpeg -i output.mp4 -vcodec libx264 output_x264.mp4 -y
mv output_x264.mp4 $outputFileName