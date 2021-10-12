## 1. What are the prerequisites for using Monokle?

You will need to install the following two prerequisites to successfully run Monokle:

1. [Helm](https://helm.sh/docs/intro/install/)
2. [Kubectl](https://kubernetes.io/docs/tasks/tools/)

## 2. What OS does Monokle support?

Monokle supports all Windows, MacOS and Linux - but provides installers for MacOS and Windows. For running Monokle on
Linux you have to run it using the source, follow the steps as outlined in the [Getting Started](./getting-started.md)
documentation.

## 3. Why can’t I add any clusters?

While adding new clusters, a valid Kubeconfig file is required. Please check if all the needed configuration settings
are present in the Kubeconfig file are valid or not. We can use validation tools like YAMLLint for that. For more detail
read [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) documentation.

## 4. Why is Kubectl required to run Monokle?

You need to install and configure kubectl for previewing [kustomization.yaml](./kustomize.md) files. It helps to debug
your configurations before you deploy them to your cluster.

## 5. Does Monokle support Helm?

Yes, Monokle allows you to navigate and preview the output of a Helm chart for an existing values files - read more at
[Working with Helm](./helm.md).

## 6. Can I work on multiple projects simultaneously?

You can launch multiple project windows using the [New Monokle Windows](../overview/#multiple-windows) option. It allows
you to work on multiple folders or clusters simultaneously thus visual navigation for the multiple pages becomes simpler
and faster.

## 7. Can I use Monokle with Flux/ArgoCD?

Yes, Monokle is used for creating / editing / debugging manifests before they are deployed to a cluster using a CD tool
like ArgoCD or Flux.

## 8. How to open Helm and Kustomization preview?

You can navigate to the resources created by Kustomize or Helm in the navigator. Hover over the resources and hit the
[preview](./features.md) button to view the source code in the editor.

## 9. Why is Autocomplete not working in the editor?

The source editor provides an auto-complete option for only native Kubernetes resources. Therefore, autocomplete feature
would not work with any other resource except the resources in the YAML manifests.

## 10. How to save changes in the editor?

Monokle source editor enables you to edit YAML manifests. The source editor automatically saves the current changes in
the code. It helps to reduce the risk of data loss, freeze, or user error.