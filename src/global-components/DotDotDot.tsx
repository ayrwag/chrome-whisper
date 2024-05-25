import styled, { keyframes } from 'styled-components';

const ellipsisAnimation = keyframes`
    0% {content:"."}
    33% { content: ".." }
    66% { content: "..." }
    100% { content: "..." }
`

export const DotDotDot = styled.span`
  &::after {
    display: inline-block;
    animation: ${ellipsisAnimation} 1.2s infinite;
    content: "";
  }
`