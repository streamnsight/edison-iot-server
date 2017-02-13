#!/usr/bin/env bash

# Use this script to install Elasticsearch and Kibana locally.
# You don't need this if you use Docker. Using Docker, run the
# docker-compose up -d
# command

function install_locally() {
	echo "Download and install services locally."
	echo "Creating database folder"
	mkdir -p database/

	echo "Downloading Elasticsearch"
	wget -q -O - https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.2.0.tar.gz | tar -xzf - -C ./database/
	pushd database
	ln -s elasticsearch-5.2.0 elasticsearch
	popd
	# enable CORS for localhost on Elasticsearch
	# Kibana being served from localhost, it fails to connect to elastic because CORS settings do not allow localhost
	echo "Enabling CORS on Elasticsearch"
	echo "http.cors.enabled: true" >> ./database/elasticsearch/config/elasticsearch.yml
	echo "http.cors.allow-origin: \"*\"" >> ./database/elasticsearch/config/elasticsearch.yml

	echo "Downloading Kibana"
	wget -q -O - https://artifacts.elastic.co/downloads/kibana/kibana-5.2.0-darwin-x86_64.tar.gz | tar -xzf - -C ./database/
	pushd database
	ln -s kibana-5.2.0-darwin-x86_64 kibana
	popd

	echo "Configuring Kibana"
	# uncomment the line in the config file that points to the localhost instance of elasticsearch
	sed -i -e "s/#elasticsearch.url/elasticsearch.url/g" ./database/kibana/config/kibana.yml
}

function use_docker() {
	echo "Using Docker";
	docker-compose up -d;
}

HASDOCKER=$(which docker)
if [ ! "$HASDOCKER" == "" ]; then
	echo "Docker engine was found, you should preferably use Docker to run these services. Install anyway? (y/N)";
	read INSTALLANYWAY;
	if [ "$INSTALLANYWAY" != "y" ]; then
		use_docker
		exit 0;
	else
		install_locally
	fi
else
	install_locally
fi
