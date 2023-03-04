import unittest
import redis

# r = redis.Redis(
#     host='hostname',
#     port=6379, 
#     password='password')

class test_redis_self_signed(unittest.TestCase):

  def test_azure_recommended_self_signed_ca(self):
    r = redis.Redis.from_url( url='rediss://:@localhost:7000/0',
        # password='password',
        ssl_cert_reqs='required',
        ssl_keyfile='./redis-az-ca/az-tls/redis.key',
        ssl_certfile='./redis-az-ca/az-tls/redis.crt',
        ssl_ca_certs='./redis-az-ca/az-tls/ca.crt')

    r.set('foo', 'bar')
    value = r.get('foo')
    print(value)
    self.assertEquals(value, "bar")


  def test_recommened_self_signed(self):
    r = redis.Redis.from_url( url='rediss://:@localhost:7002/0',
        # password='password',
        ssl_cert_reqs='required',
        ssl_keyfile='./redis/tests/tls/redis.key',
        ssl_certfile='./redis/tests/tls/redis.crt',
        ssl_ca_certs='./redis/tests/tls/ca.crt')

    r.set('foo', 'boo')
    value = r.get('foo')
    print(value)
    self.assertEqual(value, b"boo")


if __name__ == "__main__":
  unittest.main()
