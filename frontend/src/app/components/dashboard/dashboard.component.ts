import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { CommonModule } from '@angular/common';
import {FormatTimestampPipe} from "../../pipes/format-timestamp.pipe";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormatTimestampPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent implements OnInit{
  isLoading = true;
  data: any[] = [];
  @ViewChild('fileUpload') fileUpload: ElementRef | undefined;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getFilesFromServer()
  }

  uploadNew() {
    this.fileUpload?.nativeElement.click();
  }

  async getFilesFromServer() {
    this.isLoading = true;
    try {
      const response = await this.authService.getFiles().toPromise();
      this.data = response;
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async onFileSelected($event: Event) {
    console.log("upload file to server");
    const target = $event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      if (file) {
        try{
          const response = await this.authService.uploadFile(file).toPromise()
          if(response) {
            console.log(response.status)
            await this.getFilesFromServer()
          }
        }catch(err){
          console.log(err)
        }
      }
    }
  }
}
