import { makeStyles } from '@mui/styles';

import { EColor } from '@enums/enums';

const useHalfTransparentListItemStyles = makeStyles(() => ({
  halfTransparentListItem: {
    cursor: 'pointer',
    width: '100%',
    borderRadius: 3,
    transition: 'background-color 0.2s ease-out',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    position: 'relative',

    '&:hover': {
      backgroundColor: EColor.lightTransparent,
    },
  },
  halfTransparentListItemPaddingOff: {
    padding: '0px 0px',
  },
  halfTransparentListItemDisabled: {
    '&:hover': {
      backgroundColor: EColor.transparent,
    },
  },
}));

export default useHalfTransparentListItemStyles;