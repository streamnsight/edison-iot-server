# Simple IoT server setup

This setup uses the Elasticsearch database, along with Kibana (Dashboard for Elasticsearch) which helps to configure and discover data in Elasticsearch

While Kibana is powerful to visualize aggregates, it is not ideal to visualizing individual device metrics.

Grafana, another open-source dashboarding server, is more easily configurable and will be used here.

More info on:

- Elasticsearch: https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html
- Kibana: https://www.elastic.co/guide/en/kibana/current/index.html
- Grafana: http://docs.grafana.org/

## Setting up Elasticsearch, Kibana, Grafana

I recommend using Docker to install the server services, because Docker runs linux containers on any platform, making the infrastructure easily deployable anywhere.

If you want to install the services locally, run the `install.sh` shell script which installs Elasticsearch and Kibana.
This was written for Mac OS, and should also work on Linux, but not Windows.

### Docker setup
Docker is a container manager (much like a VM) and uses images that are pre-built and maintained by the developper of the services.
To learn more about Docker, visit:
https://docs.docker.com/

- To install Docker on Mac OS X, visit: https://docs.docker.com/docker-for-mac/
- To install Docker on Windows, visit: https://docs.docker.com/docker-for-windows/
- To install Docker on Linux visit: https://docs.docker.com/engine/installation/linux/

For more info on the pre-built Docker images:

- https://hub.docker.com/_/elasticsearch/
- https://hub.docker.com/_/kibana/
- https://hub.docker.com/r/grafana/grafana/

To run these services with docker, a `docker-compose.yml` file is provided at the root of the repo.
It defines how services should be started and linked together.

```yaml
version: '2'
services:
  # define elasticsearch service
  elasticsearch:
    # use official image based on alpine linux
    image: elasticsearch:5.2-alpine
    ports:
    # elasticsearch runs on port 9200, and will be mapped to localhost port 9200
    - "9200:9200"
    - "9300:9300"
    volumes:
    # use local volume for storage (so it persists when container is shut down
    - ./database/elasticsearch/data:/usr/share/elasticsearch/data
    - ./database/elasticsearch/config:/usr/share/elasticsearch/config
  # define Kibana service
  kibana:
    # use official Kibana 5.2 image
    image: kibana:5.2
    # Kibana runs on port 5601 and will be mapped to localhost port 5601
    ports:
    - "5601:5601"
    # link Kibana service to elasticsearch service
    depends_on:
    - elasticsearch
  # define grafana service
  grafana:
    # use official Grafana image
    image: grafana/grafana
    # Grafana runs on port 3000 and will be mapped to localhost port 3000
    ports:
    - "3000:3000"
    # define admin password here, through an environment variable
    environment:
    - "GF_SECURITY_ADMIN_PASSWORD=secret"
    volumes:
    - "./database/grafana:/var/lib/grafana"
    # link Grafana service to elasticsearch service
    depends_on:
    - elasticsearch
```

More info on Docker-Compose:
https://docs.docker.com/compose/overview/

### Running the services

run the command `docker-compose up -d` to run the all the services as daemons

By default `docker-compose` uses the local file called `docker-compose.yml` as config file.

To specify another file use the `-f <filename>` flag

- `docker-compose stop` stops the services and they can be restarted from that state.
- `docker-compose kill` kills the services (and they will need to be recreated)
- `docker-compose rm` removes the services containers

### Grafana

Grafana is located at

http://localhost:3000/

`username/password` is `admin/secret`


#### Dashboard

Upload the dashboard file `Grafana-dashboard.json` from the repo to quickly get started with a pre-built dashboard.


If you want to create your own dashboard, the following will help:

#### Template Variables

http://docs.grafana.org/features/datasources/elasticsearch/

In order to list all devices by id, a template variable for 'id' needs to be configured.

- Go to Dashboard -> Settings (gear icon) -> Templating
- Under Variables click 'New'
- Name the variable (id). Type should be 'Query'
- Select the Datasource (Elastic)
- Select Refresh (On Time Range Changed) so that the list gets updated when a device starts sending data
- Set the Query to `{"find":"terms", "field":"meta.id"}`
- Select Multi-Values (to allow selecting multiple devices to show on one graph)
- Select Include All Option to allow selection of all devices


#### Elasticsearch mappings

After setting the variable, you might see errors in the Elastic logs

to fix this, you need to update the mappings:

The easiest way is to use the dev tools in Kibana
Kibana is located at

- http://localhost:5601

```
PUT iotdemo/_mapping/edison
{
	"properties": {
	  "data": {
		"properties": {
		  "accel_x": {
			"type": "float"
		  },
		  "accel_y": {
			"type": "float"
		  },
		  "accel_z": {
			"type": "float"
		  },
		  "acceleration": {
			"type": "float"
		  },
		  "button": {
			"type": "text",
			"fields": {
			  "keyword": {
				"type": "keyword",
				"ignore_above": 256
			  }
			}
		  },
		  "inclination": {
			"type": "float"
		  },
		  "orientation": {
			"type": "long"
		  },
		  "pitch": {
			"type": "float"
		  },
		  "potentiometer": {
			"type": "float"
		  },
		  "roll": {
			"type": "float"
		  },
		  "temperature_celsius": {
			"type": "long"
		  },
		  "temperature_fahrenheit": {
			"type": "float"
		  }
		}
	  },
	  "meta": {
		"properties": {
		  "id": {
			"type": "text",
			"fielddata":true,
			"fields": {
			  "keyword": {
				"type": "keyword",
				"ignore_above": 256
			  }
			}
		  },
		  "timestamp": {
			"type": "date"
		  }
		}
	  }
	}
}
```

## Services:

If you run this locally,
- Kibana runs on http://localhost:5601
- Grafana runs on http://localhost:3000
- This server runs on http://localhost:3001

If you're sending your data from the IoT client project to a remote server, check with the server owner for the location of the services.
