export default class AppActions {
    static IN_TASK = 'IN_TASK';
    static setTaskStatus = (taskStatus) => {
        return {
            payload: taskStatus,
            type: AppActions.IN_TASK
        };
    }
}
