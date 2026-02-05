// Tabs component with progressive enhancement
export class Tabs {
  private tabList: HTMLElement;
  private tabs: NodeListOf<HTMLButtonElement>;
  private panels: NodeListOf<HTMLElement>;
  
  constructor(container: HTMLElement) {
    this.tabList = container.querySelector('[role="tablist"]')!;
    this.tabs = container.querySelectorAll('[role="tab"]');
    this.panels = container.querySelectorAll('[role="tabpanel"]');
    
    this.init();
  }
  
  private init() {
    // Set up ARIA attributes
    this.tabs.forEach((tab, index) => {
      tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
      tab.addEventListener('click', () => this.selectTab(index));
      tab.addEventListener('keydown', (e) => this.handleKeydown(e, index));
    });
    
    // Show first panel by default
    this.selectTab(0);
  }
  
  private selectTab(index: number) {
    // Update tabs
    this.tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute('aria-selected', isSelected.toString());
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      tab.classList.toggle('active', isSelected);
    });
    
    // Update panels
    this.panels.forEach((panel, i) => {
      panel.classList.toggle('active', i === index);
    });
  }
  
  private handleKeydown(event: KeyboardEvent, currentIndex: number) {
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
        break;
      case 'ArrowRight':
        newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = this.tabs.length - 1;
        break;
      default:
        return;
    }
    
    event.preventDefault();
    this.selectTab(newIndex);
    this.tabs[newIndex].focus();
  }
}

// Auto-initialize tabs
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const tabsContainers = document.querySelectorAll('.tabs-container');
    tabsContainers.forEach(container => new Tabs(container as HTMLElement));
  });
}