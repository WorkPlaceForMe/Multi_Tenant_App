import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMSBRANCH: NbMenuItem[] = [
  // {
  //   title: 'E-commerce',
  //   icon: 'shopping-cart-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  {
    title: "Start",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Features for Branch",
    group: true,
  },
  {
    title: "Accounts",
    icon: "people-outline",
    link: "accounts",
  },
  // {
  //   title: 'FR Users',
  //   icon: 'browser-outline',
  //   link: 'management'
  // },
  // {
  //   title: 'Dashboard',
  //   icon: 'clipboard-outline',
  //   link: 'analytics'
  // },
  {
    title: "Cameras",
    icon: "video-outline",
    children: [
      {
        title: "Cameras List",
        link: "camerasList",
      },
      {
        title: "Add Camera",
        link: "cameras/add_camera",
      },
    ],
  },
  {
    title: "Dashboards",
    icon: "bar-chart-outline",
    link: "graphs",
  },
  {
    title: "Tickets",
    icon: "done-all-outline",
    link: "tickets",
  },
  {
    title: "Stored Videos",
    icon: "film-outline",
    children: [
      {
        title: "Video List",
        link: "search/list",
      },
      {
        title: "Add Video",
        link: "search/upload",
      },
      {
        title: "Forensic Search",
        link: "search/bar",
      },
      {
        title: "Summarization",
        link: "search/summarization",
      }
    ],
  },
  {
    title: "Help",
    icon: "paper-plane-outline",
    link: "helpdesk",
  },
];
export const MENU_ITEMSADMIN: NbMenuItem[] = [
  // {
  //   title: 'E-commerce',
  //   icon: 'shopping-cart-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  // {
  //   title: 'IoT Dashboard',
  //   icon: 'home-outline',
  //   link: '/pages/iot-dashboard',
  // },
  {
    title: "Start",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Features for Admin",
    group: true,
  },
  {
    title: "Accounts",
    icon: "people-outline",
    link: "accounts",
  },
];

export const MENU_ITEMSCLIENT: NbMenuItem[] = [
  {
    title: "Start",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Features for Client",
    group: true,
  },
  {
    title: "Accounts",
    icon: "people-outline",
    link: "accounts",
  },
  {
    title: "Reports",
    icon: "bar-chart-outline",
    link: "graphs",
  },
  {
    title: "Tickets",
    icon: "done-all-outline",
    link: "tickets",
  },
  {
    title: "Stored Videos",
    icon: "film-outline",
    children: [
      {
        title: "Video List",
        link: "search/list",
      },
      {
        title: "Add Video",
        link: "search/upload",
      },
      {
        title: "Forensic Search",
        link: "search/bar",
      },
      {
        title: "Summarization",
        link: "search/summarization",
      }
    ],
  },
  {
    title: "Helpdesk",
    icon: "browser-outline",
    link: "helpdesk-listing",
  },
  {
    title: "Incident Logs",
    icon: "star",
    link: "incident-logs",
  },
];

export const MENU_ITEMSUSER: NbMenuItem[] = [
  {
    title: "Start",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Features for User",
    group: true,
  },
  {
    title: "Cameras",
    icon: "video-outline",
    children: [
      {
        title: "Cameras List",
        link: "camerasList",
        home: true,
      },
    ],
  },
  {
    title: "Dashboards",
    icon: "bar-chart-outline",
    link: "graphs",
  },
  {
    title: "Tickets",
    icon: "done-all-outline",
    link: "tickets",
  },
  // {
  //   title: 'Controls',
  //   icon: 'power-outline',
  //   link: 'settings'
  // }
  {
    title: "Help",
    icon: "paper-plane-outline",
    link: "helpdesk",
  },
];
