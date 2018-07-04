import React from 'react';
import styled, { withTheme } from 'styled-components';
import { InputField } from '../../../../components/form';

const Box = styled.div`
  background-color: ${props => props.color};
  width: 3rem;
  height: 3rem;
  border-radius: 0.3rem;
  opacity: ${props => (props.active ? 1 : 0.3)};
  margin-left: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active && '3px 3px 12px rgba(0,0,0, .3)'};
`;
const FlexBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
`;

class ThemeColorChooser extends React.Component {
  render() {
    const { theme, value, onChange } = this.props;
    const { primary, secondary, ...colors } = theme.palette;
    return (
      <InputField label="Theme color" lightMode type="text" horizontal>
        <FlexBox>
          {Object.values(colors).map(color => (
            <Box
              key={'colored-box-' + color}
              color={color}
              onClick={() => onChange(color)}
              active={value === color}
            />
          ))}
        </FlexBox>
      </InputField>
    );
  }
}

export default withTheme(ThemeColorChooser);
