#!/usr/bin/env bash

function run_local() {
	./database/elasticsearch/bin/elasticsearch -d -p elastic.pid
	./database/kibana/bin/kibana  -d -p kibana.pid

	# run IoT server
	node bin/www

}

function use_docker() {
	docker-compose up -d
}

HASDOCKER=$(which docker)
if [ ! "$HASDOCKER" == "" ]; then
	use_docker
	exit 0;
else
	install_locally
fi

# open grafana dashboard
open http://localhost:3000
# open kibana dashboard
open http://localhost:5601

