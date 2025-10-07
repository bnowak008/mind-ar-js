import css from './ui.scss';
import loadingHTML from './loading.html';
import compatibilityHTML from './compatibility.html';
import scanningHTML from './scanning.html';

const e = (id: string) => {
  return document.getElementById(id);
};

export class UI {
  loadingModal: HTMLElement | null = null;
  compatibilityModal: HTMLElement | null = null;
  scanningMask: HTMLElement | null = null;

  constructor({ uiLoading, uiScanning, uiError }: { uiLoading: string, uiScanning: string, uiError: string }) {
    const cssBlock=document.createElement('style');
    cssBlock.innerText=css.toString();
    document.head.appendChild(cssBlock);
    if (uiLoading === 'yes') {
      this.loadingModal = this._loadHTML(loadingHTML.toString());
    } else if (uiLoading !== 'no') {
      this.loadingModal = document.querySelector(uiLoading);
    }

    if (uiError === 'yes') {
      this.compatibilityModal = this._loadHTML(compatibilityHTML.toString());
    } else if (uiError !== 'no') {
      this.compatibilityModal = document.querySelector(uiError);
    }

    if (uiScanning === 'yes') {
      this.scanningMask = this._loadHTML(scanningHTML.toString());
    } else if (uiScanning !== 'no') {
      this.scanningMask = document.querySelector(uiScanning);
    }

    this.hideLoading();
    this.hideCompatibility();
    this.hideScanning();
  }

  showLoading() {
    if (!this.loadingModal) return;
    this.loadingModal.classList.remove("hidden");
  }
  hideLoading() {
    if (!this.loadingModal) return;
    this.loadingModal.classList.add("hidden");
  }
  showCompatibility() {
    if (!this.compatibilityModal) return;
    this.compatibilityModal.classList.remove("hidden");
  }
  hideCompatibility() {
    if (!this.compatibilityModal) return;
    this.compatibilityModal.classList.add("hidden");
  }
  showScanning() {
    if (!this.scanningMask) return;
    this.scanningMask.classList.remove("hidden");
  }
  hideScanning() {
    if (!this.scanningMask) return;
    this.scanningMask.classList.add("hidden");
  }

  _loadHTML(html: string) {
    const e = document.createElement('template');
    e.innerHTML = html.trim();
    const rootNode = e.content.firstChild;

    document.getElementsByTagName('body')[0].appendChild(rootNode as Node);

    return rootNode as HTMLElement;
  }
}



