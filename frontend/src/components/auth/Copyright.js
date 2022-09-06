import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Languages from '../lang/Languages'

export default function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'© '}
            <Link color="inherit" href="/">
                Guess the Score - World Cup  2022
      </Link>
      <Languages/>
        </Typography>
    );
}
