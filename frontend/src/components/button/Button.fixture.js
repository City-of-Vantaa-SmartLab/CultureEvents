import Button from './index';

export default [
  {
    component: Button,
    name: 'default',
    props: {
      children: 'Default button',
    },
  },
  {
    component: Button,
    name: 'colored',
    props: {
      children: 'Button with overrided color',
      backgroundColor: '#5E35B1',
    },
  },
  {
    component: Button,
    name: 'colored light',
    props: {
      children: 'Button with overrided color, but light',
      backgroundColor: '#FFE0B2',
    },
  },
];
