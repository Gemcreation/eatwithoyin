import amalaEwedu from '../../assets/images/amalaewedu.jpg'
import beansDodo from '../../assets/images/beansdodo.jpg'
import iyan from '../../assets/images/iyan.jpg'
import moiMoi from '../../assets/images/moimoi.jpg'
import rice from '../../assets/images/oyin-rice.png'
import yamEgg from '../../assets/images/yamegg.jpg'
import jollofRice from '../../assets/images/item-rice.png'

import type { Food, FoodCategory } from './types'

export const foods: Food[] = [
  {
    id: 'jollof-chicken',
    name: 'Jollof Rice & Chicken',
    description: 'Smoky party-style jollof served with well-seasoned chicken and sweet plantain.',
    price: 5500,
    image: rice,
    category: 'Rice',
    available: true,
  },
  {
    id: 'jollof-beef',
    name: 'Jollof Rice & Beef',
    description: 'Fragrant jollof rice with tender beef and a side of golden plantain.',
    price: 4800,
    image: jollofRice,
    category: 'Rice',
    available: true,
  },
  {
    id: 'fried-rice-chicken',
    name: 'Fried Rice & Chicken',
    description: 'Vegetable fried rice with a juicy chicken portion and fresh coleslaw.',
    price: 5500,
    image: 'https://img.freepik.com/premium-photo/simple-side-dish-tomato-rice-with-roasted-chicken-quarters-cooked-basmati-rice-with-red-chili-powder-cinnamon-cardamom-cloves-parsley-white-plate-top-view-close-up_268847-1173.jpg?w=740',
    category: 'Chicken',
    available: true,
  },
  {
    id: 'jollof-fish',
    name: 'Jollof Rice & Fish',
    description: 'Spiced jollof rice with a crisp, seasoned fish portion and plantain.',
    price: 5200,
    image: 'https://img.freepik.com/premium-photo/fish-biryani-fish-rice-popular-indian-non-vegetarian-recipe-made-fish-marinated-with-indian-spices-fresh-herbs-cooked-with-basmati-rice-selective-focus_466689-59925.jpg?w=740',
    category: 'Rice',
    available: true,
  },
  {
    id: 'amala-ewedu',
    name: 'Amala & Ewedu',
    description: 'Soft amala with ewedu, gbegiri, rich stew and a choice cut of meat.',
    price: 4200,
    image: amalaEwedu,
    category: 'Local Dishes',
    available: true,
  },
  {
    id: 'pounded-yam',
    name: 'Pounded Yam & Egusi',
    description: 'Smooth pounded yam paired with hearty egusi soup.',
    price: 4500,
    image: iyan,
    category: 'Local Dishes',
    available: false,
  },
  {
    id: 'beans-dodo',
    name: 'Beans & Dodo',
    description: 'Comforting beans served with ripe fried plantain.',
    price: 3200,
    image: beansDodo,
    category: 'Local Dishes',
    available: true,
  },
  {
    id: 'moi-moi',
    name: 'Moi Moi',
    description: 'Steamed bean pudding, made fresh and served with a little stew.',
    price: 1200,
    image: moiMoi,
    category: 'Local Dishes',
    available: true,
  },
  {
    id: 'yam-egg',
    name: 'Yam & Egg Sauce',
    description: 'Tender yam with a lightly spiced tomato and egg sauce.',
    price: 3500,
    image: yamEgg,
    category: 'Local Dishes',
    available: true,
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    description: 'Chilled 50cl bottle.',
    price: 500,
    image: 'https://img.freepik.com/premium-photo/close-up-coca-cola-glass-against-white-background_1048944-16447408.jpg?w=360',
    category: 'Drinks',
    available: true,
  },
  {
    id: 'five-alive',
    name: '5 Alive Orange',
    description: 'Chilled fruit juice.',
    price: 900,
    image: 'https://www.coca-cola.com/content/dam/onexp/ng/home-image/brands/5alive/5-Alive-Pulpy-desktop.jpg',
    category: 'Drinks',
    available: true,
  },
]

export const foodCategories: Array<'All' | FoodCategory> = [
  'All',
  'Rice',
  'Chicken',
  'Local Dishes',
  'Drinks',
  'Snacks',
]