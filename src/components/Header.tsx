import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import SisuHealthLogo from 'assets/sisu-health.png';

const HeaderWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 3rem 0;
`;

const StyledLogo = styled.img`
  height: 3rem;
  width: auto;
  margin-right: 2rem;
`;

const HighlightedTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.primary.main};
  flex: 1;
`;

type HeaderProps = {
  title?: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => (
  <HeaderWrapper>
    <StyledLogo src={SisuHealthLogo} alt="logo" />
    <HighlightedTypography variant="h4" align="center" fontWeight="bold">
      {title}
    </HighlightedTypography>
  </HeaderWrapper>
);

export default Header;
