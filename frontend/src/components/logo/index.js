import React from 'react';

const SvgComponent = props => (
  <svg viewBox="0 0 108.92 110.66" {...props}>
    <defs />
    <title>VantaaLogo</title>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <g id="Group_4" data-name="Group 4">
          <g id="Group_3" data-name="Group 3">
            <g id="Group_1" data-name="Group 1">
              <path
                id="Path_6"
                data-name="Path 6"
                d="M.13 55.94L58.13 0l50.72 61.86z"
                fill="#0542a3"
              />
              <path
                id="Path_5"
                data-name="Path 5"
                d="M108.84 61.87L55.17 17.26.19 56z"
                fill="#3f8edb"
              />
              <path
                id="Path_4-2"
                data-name="Path 4-2"
                d="M0 56l50.77-24.9L108.92 62 62 110.66z"
                fill="#86cbf6"
              />
            </g>
            {props.noText || (
              <text
                transform="translate(20 69.15)"
                fontSize={20}
                fontFamily="GT-Walsheim"
                fontWeight={500}
                letterSpacing="-.01em"
                id="Vantaa"
                fill="white"
              >
                <tspan className="cls-6">Vantaa</tspan>
              </text>
            )}
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default SvgComponent;
