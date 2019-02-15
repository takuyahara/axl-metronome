import cn from 'classnames';

export interface ICssSelector {
  [s: string]: string;
}

class Utils {
  private constructor() {
    // Just implement static functions
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
