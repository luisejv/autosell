import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/core/services/admin.service';
import Swal from 'sweetalert2';

interface BannerResponse {
  id: number;
  foto: string;
}
@Component({
  selector: 'app-change-banner',
  templateUrl: './change-banner.component.html',
  styleUrls: ['./change-banner.component.css'],
})
export class ChangeBannerComponent implements OnInit {
  @ViewChild('bannerInput') input!: ElementRef<HTMLInputElement>;
  bannerUrl: string = '';
  bannerSelected: boolean = false;
  banner!: File;
  uploadingBanner: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getBanner().subscribe(
      (res: BannerResponse[]) => {
        console.group('banner response');
        console.log(res);
        this.bannerUrl = res[0] ? res[0].foto : '';
        console.groupEnd();
      },
      (err: any) => {
        console.error('fetching banner: ', { err });
      },
      () => {}
    );
  }

  selectBanner(e: any): void {
    console.log(e.target.files);

    if (e.target.files.length > 0) {
      this.banner = e.target.files[0];
    }

    this.bannerSelected = true;
  }

  uploadBanner(): void {
    this.uploadingBanner = true;
    this.bannerSelected = false;
    const formData: FormData = new FormData();
    formData.append('file', this.banner);
    this.adminService.postBanner(formData).subscribe(
      (res: BannerResponse) => {
        this.bannerUrl = res.foto;
        console.log('banner uploaded successfully: ', { res });
        Swal.fire({
          icon: 'success',
          title: '¡Banner actualizado!',
        });
      },
      (err: any) => {
        console.log('banner uploaded failure: ', { err });
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          html: 'Ocurrió un error al subir el banner.',
        });
      },
      () => {
        this.bannerSelected = false;
        this.uploadingBanner = false;
        this.input.nativeElement.value = '';
      }
    );
  }
}
