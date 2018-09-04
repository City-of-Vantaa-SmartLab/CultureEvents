import Typography from './index';
import React from 'react';

export default [
  {
    component: Typography,
    name: 'headline',
    props: {
      children: 'Lorem Ipsum',
      type: 'headline',
    },
  },
  {
    component: Typography,
    name: 'title',
    props: {
      children: 'Lorem Ipsum title',
      type: 'title',
    },
  },
  {
    component: Typography,
    name: 'subheader',
    props: {
      children: 'Lorem Ipsum',
      type: 'subheader',
    },
  },
  {
    component: Typography,
    name: 'body',
    props: {
      children:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      type: 'body',
    },
  },
  {
    component: ({ types, bodies }) => (
      <div>
        <Typography type={types[0]}>{bodies[0]}</Typography>
        <Typography type={types[1]}>{bodies[1]}</Typography>
        <Typography type={types[2]}>{bodies[2]}</Typography>
      </div>
    ),
    name: 'combination of text',
    props: {
      types: ['headline', 'subheader', 'body'],
      bodies: [
        'Quantum gravity',
        'What is it?',
        'Much of the difficulty in meshing these theories at all energy scales comes from the different assumptions that these theories make on how the universe works. General relativity models gravity as curvature of spacetime: in the slogan of John Archibald Wheeler, "Spacetime tells matter how to move; matter tells spacetime how to curve."[9] On the other hand, quantum field theory is typically formulated in the flat spacetime used in special relativity. No theory has yet proven successful in describing the general situation where the dynamics of matter, modeled with quantum mechanics, affect the curvature of spacetime. If one attempts to treat gravity as simply another quantum field, the resulting theory is not renormalizable.[5] Even in the simpler case where the curvature of spacetime is fixed a priori, developing quantum field theory becomes more mathematically challenging, and many ideas physicists use in quantum field theory on flat spacetime are no longer applicable.',
      ],
    },
  },
];
