import Component from '../Component';
import * as constants from './constants';

export default class Footer extends Component {
  constructor() {
    super({
      tagName: 'footer',
      classNames: ['footer'],
    });

    this.render();
  }

  private render(): void {
    const containerComponent = new Component({ classNames: ['footer__container', 'container'] });
    const bodyComponent = new Component({ classNames: ['footer__body'] });
    const schoolLinkComponent = this.getRenderedSchoolLinkComponent();
    const textComponent = this.getRenderedTextComponent();

    this.append(containerComponent);
    containerComponent.append(bodyComponent);
    bodyComponent.append(schoolLinkComponent, textComponent);
  }

  private getRenderedTextComponent(): Component {
    const textComponent = new Component({
      tagName: 'p',
      classNames: ['footer__text'],
      textContent: constants.PARAGRAPH_TEXT_CONTENT,
    });
    const gitHubLinkComponent = this.createLinkComponent(constants.GITHUB_LINK);

    textComponent.append(gitHubLinkComponent);

    return textComponent;
  }

  private getRenderedSchoolLinkComponent(): Component {
    const schoolLinkComponent = this.createLinkComponent(constants.SCHOOL_LINK);
    const imgComponent = new Component({
      tagName: 'img',
      classNames: ['footer__img'],
      attributes: {
        src: constants.SCHOOL_IMG_PATH,
        alt: constants.SCHOOL_IMG_ALT,
        width: constants.SCHOOL_IMG_WIDTH.toString(),
        height: constants.SCHOOL_IMG_HEIGHT.toString(),
      },
    });

    schoolLinkComponent.append(imgComponent);

    return schoolLinkComponent;
  }

  private createLinkComponent(href: string): Component {
    const linkComponent = new Component({
      tagName: 'a',
      classNames: ['footer__link'],
      attributes: {
        target: '_blank',
        href,
      },
    });

    return linkComponent;
  }
}
