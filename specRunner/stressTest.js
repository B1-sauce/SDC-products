import app from '../app.js';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
export let errorRate = new Rate('errors');


beforeAll((done) => {
  mongoose.connect(
    "mongodb://localhost:27017/test1",
    { useNewUrlParser: true },
    () => done()
  )
})
export default function () {
  check(app.get('/products?page=1&count=5'), {
    'status is 201': (r) => r.status == 200,
  }) || errorRate.add(1);
}