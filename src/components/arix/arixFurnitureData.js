import bedImg from '../../assets/furniture/bed.png';
import deskImg from '../../assets/furniture/desk.png';
import sofaImg from '../../assets/furniture/sofa.png';
import wardrobeImg from '../../assets/furniture/wardrobe.png';
import diningImg from '../../assets/furniture/dining_table.png';
import bookshelfImg from '../../assets/furniture/bookshelf.png';

import bedLogo from '../../assets/furniture/bed logo.jpg';
import bookshelfLogo from '../../assets/furniture/bookshelf logo.png';
import deskLogo from '../../assets/furniture/desk logo.jpg';
import diningLogo from '../../assets/furniture/dining_table logo.png';
import sofaLogo from '../../assets/furniture/sofa logo.jpg';
import wardrobeLogo from '../../assets/furniture/wardrobe logo.jpg';

export const FURNITURE_ITEMS = [
  { id: 'bookshelf',    name: 'Bookshelf',     price: 15,  icon: 'book',    image: bookshelfImg,    thumbnail: bookshelfLogo,    position: { top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' } },
  { id: 'wardrobe',     name: 'Wardrobe',      price: 25,  icon: 'wardrobe',image: wardrobeImg,     thumbnail: wardrobeLogo,     position: { top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' } },
  { id: 'bed',          name: 'Queen Bed',     price: 45,  icon: 'bed',     image: bedImg,          thumbnail: bedLogo,          position: { top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' } },
  { id: 'desk',         name: 'Work Desk',     price: 20,  icon: 'desk',    image: deskImg,         thumbnail: deskLogo,         position: { top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' } },
  { id: 'dining_table', name: 'Dining Table',  price: 30,  icon: 'table',   image: diningImg,      thumbnail: diningLogo,      position: { top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' } },
  { id: 'sofa',         name: 'Sofa',          price: 35,  icon: 'sofa',    image: sofaImg,         thumbnail: sofaLogo,         position: { top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' } },
];


