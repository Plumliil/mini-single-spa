import bootstrapApp from '../lifecycle/bootstrap'
import mountApp from '../lifecycle/mount'
import unMountApp from '../lifecycle/unmount'
import { Application, AppStatus } from '../types'

// export enum AppStatus {
//   BEFORE_BOOTSTRAP = 'BEFORE_BOOTSTRAP',
//   BOOTSTRAPPED = 'BOOTSTRAPPED',
//   BEFORE_MOUNT = 'BEFORE_MOUNT',
//   MOUNTED = 'MOUNTED',
//   BEFORE_UNMOUNT = 'BEFORE_UNMOUNT',
//   UNMOUNTED = 'UNMOUNTED',
//   BOOTSTRAP_ERROR = 'BOOTSTRAP_ERROR',
//   MOUNT_ERROR = 'MOUNT_ERROR',
//   UNMOUNT_ERROR = 'UNMOUNT_ERROR',
// }

// export interface Application {
//   name: string
//   activeRule: Function | string
//   loadApp: () => Promise<any>
//   props: AnyObject | Function
//   status?: AppStatus
//   container?: HTMLElement
//   bootstrap?: (props: AnyObject) => Promise<any>
//   mount?: (props: AnyObject) => Promise<any>
//   unmount?: (props: AnyObject) => Promise<any>
// }

// 已注册应用集合
export const apps: Application[] = []

export async function loadApps() {
    // 获取状态为MOUNTED的应用
    const toUnMountApp = getAppsWithStatus(AppStatus.MOUNTED)
    // 对状态为MOUNTED的应用调用unMountApp方法 进行应用程序卸载
    await Promise.all(toUnMountApp.map(unMountApp))
    // 获取状态为BEFORE_BOOTSTRAP的应用
    const toLoadApp = getAppsWithStatus(AppStatus.BEFORE_BOOTSTRAP)
    // 对状态为BEFORE_BOOTSTRAP的应用调用bootstrop函数 进行初始化
    await Promise.all(toLoadApp.map(bootstrapApp))

    const toMountApp = [
        ...getAppsWithStatus(AppStatus.BOOTSTRAPPED),
        ...getAppsWithStatus(AppStatus.UNMOUNTED),
    ]
    await toMountApp.map(mountApp)
}
/**
 * 这个函数用于获取具有特定状态的应用程序的列表。它被多次调用，
 * 传入不同的 AppStatus 枚举值作为参数，从而获取不同状态的应用程序列表。
 * 这可能是一个用于筛选应用程序的辅助函数。
 * @param status 应用状态
 * @returns
 */
function getAppsWithStatus(status: AppStatus) {
    // 收集筛选后的应用
    const result: Application[] = []
    apps.forEach((app) => {
    // tobootstrap or tomount
        if (isActive(app) && app.status === status) {
            switch (app.status) {
                case AppStatus.BEFORE_BOOTSTRAP:
                case AppStatus.BOOTSTRAPPED:
                case AppStatus.UNMOUNTED:
                    result.push(app)
                    break
            }
        } else if (
            app.status === AppStatus.MOUNTED
      && status === AppStatus.MOUNTED
        ) {
            // tounmount
            result.push(app)
        }
    })

    return result
}

function isActive(app: Application) {
    return typeof app.activeRule === 'function' && app.activeRule(window.location)
}
