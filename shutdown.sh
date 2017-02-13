#!/usr/bin/env bash


function shutdown_local_services(){
	# kill servives by PID
	kill `cat kibana.pid`
	kill `cat elastic.pid`
	# brute force
	#kill -9 $(ps | grep kibana | awk '{print $1}' | head -n1)
}

function use_docker() {
	docker-compose stop
}

HASDOCKER=$(which docker)
if [ ! "$HASDOCKER" == "" ]; then
	use_docker
	exit 0;
else
	shutdown_local_services
fi
