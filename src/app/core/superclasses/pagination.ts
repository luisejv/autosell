export class Pagination {
  readonly carsPerPage: number = 9;
  pgCnt: number = 0;
  pages: number[] = [0];
  currPage: number = 0;
  minPage: number = 0;
  maxPage: number = 10;

  constructor() {}

  updatePagination(elementCount: number): void {
    this.currPage = 0;
    this.pgCnt = Math.ceil(elementCount / this.carsPerPage);
    this.pages = Array(this.pgCnt)
      .fill(this.pgCnt)
      .map((x: any, i: any) => i);
    this.minPage = 0;
    this.maxPage = this.pgCnt > 10 ? 10 : this.pgCnt;
    this.currPage = this.minPage;
  }

  rewind(): void {
    this.minPage = 0;
    this.maxPage = this.pgCnt > 10 ? 10 : this.pgCnt;
    this.goToPage(this.minPage);
  }

  forward(): void {
    this.minPage = this.pgCnt - 10;
    this.minPage = this.pgCnt > 10 ? this.pgCnt - 10 : 0;
    this.maxPage = this.pgCnt;
    this.goToPage(this.maxPage - 1);
  }

  next(): void {
    if (this.maxPage + 10 <= this.pgCnt) {
      this.minPage = this.minPage + 10;
      this.maxPage = this.maxPage + 10;
    } else {
      this.minPage = this.pgCnt > 10 ? this.pgCnt - 10 : 0;
      this.maxPage = this.pgCnt;
    }

    this.goToPage(this.minPage);
  }

  prev(): void {
    if (this.minPage - 10 >= 0) {
      this.minPage = this.minPage - 10;
      this.maxPage = this.maxPage - 10;
    } else {
      this.minPage = 0;
      this.maxPage = this.pgCnt > 10 ? 10 : this.pgCnt;
    }
    this.goToPage(this.minPage);
  }

  goToPage(pageId: number): void {
    this.currPage = pageId;
    window.scrollTo(0, 300);
  }
}
