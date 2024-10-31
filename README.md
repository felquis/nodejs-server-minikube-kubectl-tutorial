### Server

How to run the program:

The simplest way to run this nodejs express http server is to do:

```
pnpm install
pnpm run server
```

and open `localhost:3000`

However the goal is to run it with minikube and kubectl

#### Running with minikube and kubectl

First, follow [minikube](https://minikube.sigs.k8s.io/docs/start/) and [kubectl](https://Kuberbetes.io/docs/tasks/tools/#kubectl) installation instructions.

You're also going to need docker, because minikube runs with docker.

Once your docker daemon is ready, run `minikube start`, this command is going to create a docker container called minikube.

Minikube creates a Kuberbetes cluster in your local environment on top of docker, which means once it's running we can begin interacting with Kuberbetes with the `kubectl` command.

Before running any kubectl command, let's build our docker image from our project source.

to do so, we need to ensure our terminal does not point to our computer host docker command, but to minikube inner docker command instead.

If you don't do it, when you try to deploy the application, the command `kubectl get pods` is going to return a bunch of `STATUS: ErrImagePull` errors.

On your terminal session, make sure docker points to minikube's docker with this command:

```
eval $(minikube docker-env)
```

Our minikube config is done, let's build the docker image, run this command:

```
docker build -t myapp:local .
```

Now that you have minikube and the docker image built with minikube's docker, we can deploy our `deployment.yaml` and `service.yaml` to our Minikube's Kuberbetes.

Run the commands:

```
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

These commands should exit without much output. To verify our `deployment.yaml` worked, run this command:

```
kubectl get pods
```

You should see 3 lines, each with `STATUS` column as `Completed`

```
NAME                               READY   STATUS    RESTARTS   AGE
myapp-deployment-f44dbdd55-8wtt5   1/1     Running   0          2m38s
myapp-deployment-f44dbdd55-b4fw9   1/1     Running   0          2m38s
myapp-deployment-f44dbdd55-p5t6q   1/1     Running   0          2m38s
```

At this point, if you open localhost:3000 nothing happens, that's because everything that's running in the Kuberbetes cluster is isolated.

To expose our express http server to our host computer, we need to run this command:

```
minikube service myapp-service
```

It will automatically open your default browser, and display what's the port inside Kuberbetes cluster that it is tunneling to your host computer.

`myapp-service` is defined in the service.yaml file

#### What's deployment.yaml and service.yaml

They are defined by the `kind` property inside them, deployment.yaml defines what are the resources that's being deployed, while service.yaml defines the networking that access these resources, including load balancing between replicas.

#### Development Iterations

When you change server.js, you need to rebuild the docker image and rollout the deployment with the command:

```
kubectl rollout restart deployment/myapp-deployment
```

In a single command:

```
docker build -t myapp:local . && kubectl rollout restart deployment/myapp-deployment
```

#### Troubleshooting

You can delete your deployment with:

```
kubectl delete -f deployment.yaml
```

And relaunch it with:

```
kubectl apply -f deployment.yaml
```

When you do this, you'll also need to restart the `minikube service myapp-service` command, and it'll give you a new port.

##### Logs

You can view each pod log individually with:

```
kubectl logs {pod name}
```

Get the pod name with the command `kubectl get pods`
