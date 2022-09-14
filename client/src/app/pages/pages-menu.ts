import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMSBRANCH: NbMenuItem[] = [
  // {
  //   title: 'E-commerce',
  //   icon: 'shopping-cart-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  {
    title: "Inicio",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Atributos",
    group: true,
  },
  {
    title: "Cuentas",
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
    title: "Camaras",
    icon: "video-outline",
    children: [
      {
        title: "Lista de Camaras",
        link: "camerasList",
      },
      {
        title: "Agregar Camara",
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
    title: "Videos locales",
    icon: "film-outline",
    children: [
      {
        title: "Lista de videos",
        link: "search/list",
      },
      {
        title: "Agregar Videos",
        link: "search/upload",
      },
      {
        title: "Forensic Search",
        link: "search/bar",
      },
    ],
  },
  {
    title: "Ayuda",
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
    title: "Inicio",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Atributos de Administrador",
    group: true,
  },
  {
    title: "Cuentas",
    icon: "people-outline",
    link: "accounts",
  },
];

export const MENU_ITEMSCLIENT: NbMenuItem[] = [
  {
    title: "Inicio",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Atributos de Cliente",
    group: true,
  },
  {
    title: "Cuentas",
    icon: "people-outline",
    link: "accounts",
  },
  {
    title: "Reportes",
    icon: "bar-chart-outline",
    link: "graphs",
  },
  {
    title: "Tickets",
    icon: "done-all-outline",
    link: "tickets",
  },
  {
    title: "Videos locales",
    icon: "film-outline",
    children: [
      {
        title: "Lista de videos",
        link: "search/list",
      },
      {
        title: "Agregar Videos",
        link: "search/upload",
      },
      {
        title: "Forensic Search",
        link: "search/bar",
      },
    ],
  },
  {
    title: "Helpdesk",
    icon: "browser-outline",
    link: "helpdesk-listing",
  },
  {
    title: "Incidentes Logs",
    icon: "star",
    link: "incident-logs",
  },
];

export const MENU_ITEMSUSER: NbMenuItem[] = [
  {
    title: "Inicio",
    icon: "home-outline",
    link: "/dashboard",
    hidden: true,
    home: true,
  },
  {
    title: "Atributos de User",
    group: true,
  },
  {
    title: "Camaras",
    icon: "video-outline",
    children: [
      {
        title: "Lista de camaras",
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
    title: "Ayuda",
    icon: "paper-plane-outline",
    link: "helpdesk",
  },
];
