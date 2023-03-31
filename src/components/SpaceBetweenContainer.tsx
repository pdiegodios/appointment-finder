import styled from '@emotion/styled';
import { TABLET_ONLY } from 'constants/breakpoints';

const SpaceBetweenContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  column-gap: 0.5rem;
  ${TABLET_ONLY} {
    flex-direction: column;
    row-gap: 1rem;
  }
`;

export default SpaceBetweenContainer;
