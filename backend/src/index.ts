import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { donateRouter } from './routes/donations'
import { meRouter } from './routes/me'
import { cors } from 'hono/cors'
import { carousalRouter } from './routes/carousal'

const app = new Hono()

app.use(cors());

app.route('/api/v1/user', userRouter);
app.route('/api/v1/donate', donateRouter);
app.route('/api/v1/me', meRouter);
app.route('/api/v1/carousal', carousalRouter);

export default app;
