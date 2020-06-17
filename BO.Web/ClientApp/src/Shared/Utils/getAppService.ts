import { Container, PrimitiveOrDependencyCtor } from "aurelia-framework"

export const getAppService = (key: PrimitiveOrDependencyCtor<any, any, any>): any => {
    return Container.instance.get(key);
}