import chalk from "chalk";

export default class Logger {
    static log(txt: string) {
        console.log(`[${chalk.cyan("INFO")}] ${chalk.gray(this.time)} ${txt}`);
    }

    static warn(txt: string) {
        console.log(`[${chalk.yellowBright("WARN")}] ${chalk.gray(this.time)} ${txt}`);
    }

    static error(txt: string) {
        console.log(`[${chalk.redBright("ERR!")}] ${chalk.grey(this.time)} ${txt}`);
    }

    static get time() {
        return new Date().toLocaleTimeString(undefined, {
            hour12: false
        });
    }
}