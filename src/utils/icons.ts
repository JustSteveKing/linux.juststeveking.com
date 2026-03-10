import {
  siUbuntu,
  siLinuxmint,
  siFedora,
  siArchlinux,
  siDebian,
  siPopos,
  siManjaro,
  siElementary,
  siKalilinux,
  siNixos,
  siZorin,
  siEndeavouros,
  siOpensuse,
  siVoidlinux,
  siMxlinux,
  siGarudalinux,
  siAlpinelinux,
  siGentoo,
  siRockylinux,
  siTails,
  siRaspberrypi,
  siSolus,
  siNobaralinux,
  siDeepin,
  siArtixlinux,
  siKubuntu,
  siAsahilinux,
  siSteam,
  siParrotsecurity,
  siAlmalinux,
} from 'simple-icons';

/** Subset of the simple-icons icon shape we use. */
export interface DistroIcon {
  title: string;
  slug: string;
  hex: string;
  /** SVG path data (use inside a 24×24 viewBox). */
  path: string;
}

const iconMap: Record<string, DistroIcon> = {
  ubuntu:            siUbuntu        as DistroIcon,
  linuxmint:         siLinuxmint     as DistroIcon,
  fedora:            siFedora        as DistroIcon,
  archlinux:         siArchlinux     as DistroIcon,
  debian:            siDebian        as DistroIcon,
  popos:             siPopos         as DistroIcon,
  manjaro:           siManjaro       as DistroIcon,
  elementary:        siElementary    as DistroIcon,
  kalilinux:         siKalilinux     as DistroIcon,
  nixos:             siNixos         as DistroIcon,
  zorin:             siZorin         as DistroIcon,
  endeavouros:       siEndeavouros   as DistroIcon,
  opensuse:          siOpensuse      as DistroIcon,
  voidlinux:         siVoidlinux     as DistroIcon,
  mxlinux:           siMxlinux       as DistroIcon,
  garudalinux:       siGarudalinux   as DistroIcon,
  alpinelinux:       siAlpinelinux   as DistroIcon,
  gentoo:            siGentoo        as DistroIcon,
  rockylinux:        siRockylinux    as DistroIcon,
  tails:             siTails         as DistroIcon,
  raspberrypi:       siRaspberrypi   as DistroIcon,
  solus:             siSolus         as DistroIcon,
  nobaralinux:       siNobaralinux   as DistroIcon,
  deepin:            siDeepin        as DistroIcon,
  artixlinux:        siArtixlinux    as DistroIcon,
  kubuntu:           siKubuntu       as DistroIcon,
  asahilinux:        siAsahilinux    as DistroIcon,
  steamos:           siSteam       as DistroIcon,
  parrotsecurity:    siParrotsecurity as DistroIcon,
  almalinux:         siAlmalinux     as DistroIcon,
};

export function getDistroIcon(slug: string | undefined): DistroIcon | null {
  if (!slug) return null;
  return iconMap[slug] ?? null;
}
