node_modules = './node_modules';
venv = './.venv';
azTls = './redis-az-ca/az-tls';
tls = './redis/tests';

rm -rf $venv;
rm -rf $azTls;
rm -rf $tls;
rm -rf $node_modules;

curl https://github.com/redis/redis/blob/unstable/utils/gen-test-certs.sh --output redis/gen-test-certs.sh;
(cd redis; sh ./gen-test-certs.sh);
(cd redis-az-ca; sh ./gen_certs_az.sh);

docker-compose build

npm install
python3 -m venv .venv

