import { isPromise } from 'src/utils/utils'
import { AnyObject, Application, AppStatus } from '../types'
/**
 * 用于启动应用程序的核心函数，负责应用程序的初始化和启动过程。
 * @param app 应用程序
 * @returns 
 */
export default async function bootstrapApp(app: Application) {
    // 从app中加载其声明周期函数和属性
    const { bootstrap, mount, unmount } = await app.loadApp()
    // 校验生命周期函数是否为函数类型
    validateLifeCycleFunc('bootstrap', bootstrap)
    validateLifeCycleFunc('mount', mount)
    validateLifeCycleFunc('unmount', unmount)
    // 将加载的生命周期函数赋值给对应的属性
    app.bootstrap = bootstrap
    app.mount = mount
    app.unmount = unmount

    // 初始化应用的props
    try {
    // 异步加载程序属性
        app.props = await getProps(app.props)
    } catch (err) {
        app.status = AppStatus.BOOTSTRAP_ERROR
        throw err
    }
    // 执行应用程序的 bootstrap 函数，并处理结果
    let result = (app as any).bootstrap(app.props)
    // 调用 bootstrap 函数，并将 app.props 作为参数传递。
    // 如果 bootstrap 函数的返回值不是 Promise 类型，将其包装为 Promise。
    // 返回 bootstrap 函数的 Promise。
    // 如果 bootstrap 函数执行成功，则将应用程序的状态标记为 AppStatus.BOOTSTRAPPED。
    // 如果 bootstrap 函数执行失败，则将应用程序的状态标记为 AppStatus.BOOTSTRAP_ERROR，然后再次抛出错误。
    if (!isPromise(result)) {
        result = Promise.resolve(result)
    }
    return result
    .then(() => {
        app.status = AppStatus.BOOTSTRAPPED
    })
    .catch((err: Error) => {
        app.status = AppStatus.BOOTSTRAP_ERROR
        throw err
    })
}
/**
 * 获取应用的props
 * @param props 函数props值
 * @returns 若props是一个函数返回props()执行后的结果 若props是一个对象 返回props否则返回空对象
 */
async function getProps(props: Function | AnyObject) {
    if (typeof props === 'function') return props()
    if (typeof props === 'object') return props
    return {}
}
/**
 * 该函数主要目的是检查fn是否是函数
 * @param name 函数的名称
 * @param fn 函数
 */
function validateLifeCycleFunc(name: string, fn: any) {
    if (typeof fn !== 'function') {
        throw Error(`The "${name}" must be a function`)
    }
}
