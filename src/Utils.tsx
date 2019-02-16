import cn from 'classnames';

export interface ICssSelector {
  [s: string]: string;
}

class Utils {
  private constructor() {
    // Just implement static functions
  }
  public static fixNumber(n: number): number {
    // Fix number like 0.19999999999999996 to to 0.20000
    const DECIMAL = 5;
    return Math.round(n * Math.pow(10, DECIMAL)) / Math.pow(10, DECIMAL);
  }
  public static inheritSelector(base: ICssSelector, extend: ICssSelector): void {
    Object.keys(base).forEach((style: string) => {
      if (extend[style]) {
        base[style] = cn(base[style], extend[style]);
      }
    });
  }
}
export default Utils;
