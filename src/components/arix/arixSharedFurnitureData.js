import bedsImg from '../../assets/furniture/shared_beds.png';
import desksImg from '../../assets/furniture/shared_desks.png';
import sofasImg from '../../assets/furniture/shared_sofas.png';
import wardrobesImg from '../../assets/furniture/shared_wardrobes.png';
import diningImg from '../../assets/furniture/shared_diningtable.png';

import bedLogo from '../../assets/furniture/bed logo.jpg';
import deskLogo from '../../assets/furniture/desk logo.jpg';
import diningLogo from '../../assets/furniture/dining_table logo.png';
import sofaLogo from '../../assets/furniture/sofa logo.jpg';
import wardrobeLogo from '../../assets/furniture/wardrobe logo.jpg';

export const SHARED_FURNITURE_ITEMS = [
  { id: 'beds',         name: 'Beds',          price: 45,  icon: 'bed',     image: bedsImg,         thumbnail: bedLogo,         position: { top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' } },
  { id: 'sofa',         name: 'Sofa',          price: 35,  icon: 'sofa',    image: sofasImg,        thumbnail: sofaLogo,        position: { top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' } },
  { id: 'wardrobe',     name: 'Wardrobe',      price: 25,  icon: 'wardrobe',image: wardrobesImg,   thumbnail: wardrobeLogo,    position: { top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' } },
  { id: 'desk',         name: 'Work Desk',     price: 20,  icon: 'desk',    image: desksImg,        thumbnail: deskLogo,        position: { top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' } },
  { id: 'dining_table', name: 'Dining Table',  price: 30,  icon: 'table',   image: diningImg,       thumbnail: diningLogo,      position: { top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' } },
];
