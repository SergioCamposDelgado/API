export interface City {
  nombre: string;
  latitud: number;
  longitud: number;
}

export const cities: City[] = [
  {
    nombre: "Madrid",
    latitud: 40.4168,
    longitud: -3.7038
  },
  {
    nombre: "Barcelona",
    latitud: 41.3874,
    longitud: 2.1686
  },
  {
    nombre: "Valencia",
    latitud: 39.4699,
    longitud: -0.3763
  },
  {
    nombre: "Sevilla",
    latitud: 37.3828,
    longitud: -5.9731
  },
  {
    nombre: "Bilbao",
    latitud: 43.2631,
    longitud: -2.9349
  },
  {
    nombre: "Málaga",
    latitud: 36.7197,
    longitud: -4.4181
  },
  {
    nombre: "Zaragoza",
    latitud: 41.6488,
    longitud: -0.8891
  },
  {
    nombre: "Murcia",
    latitud: 37.9922,
    longitud: -1.1307
  }
];
