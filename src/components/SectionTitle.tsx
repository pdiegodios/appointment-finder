import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { ReactNode } from 'react';

const StyledTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.primary.main};
  margin-bottom: 1rem;
`;

type SectionTitleProps = {
  children: ReactNode;
};
const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <StyledTypography variant="h6">{children}</StyledTypography>
);

export default SectionTitle;
