import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class LoaivanbanComponent extends BaseComponent implements OnInit {
  public loaivanban: any ;
  public LoaiVanBan: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenloaivanban': [''],  
    });
   
   this.search(); 
  }

  loadPage(page) { 
    this._api.post('/api/LoaiVanBan/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.LoaiVanBan = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/LoaiVanBan/search',{page: this.page, pageSize: this.pageSize, tenloaivanban: this.formsearch.get('tenloaivanban').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.LoaiVanBan = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  pwdCheckValidator(control){
    var filteredStrings = {search:control.value, select:'@#!$%&*'}
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if(control.value.length < 6 || !result){
        return {matkhau: true};
    }
  }

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
      
        let tmp = {
          
          tenloaivanban:value.tenloaivanban ,
          mota:value.mota
                     
          };
        this._api.post('/api/LoaiVanBan/create-lvb',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
    
        let tmp = {
          tenloaivanban:value.tenloaivanban,
          mota:value.mota,
          loaivanbanid:this.loaivanban.loaivanbanid,  
          };
        this._api.post('/api/LoaiVanBan/update-lvb',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/LoaiVanBan/delete-lvb',{loaivanbanid:row.loaivanbanid}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.LoaiVanBan = null;
    this.formdata = this.fb.group({
      
      'tenloaivanban': ['', Validators.required],
       'mota': ['', Validators.required],
    }, {
      validator: MustMatch('matkhau', 'nhaplaimatkhau')
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.loaivanban = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
       
        'tenloaivanban': ['', Validators.required],
         'mota': ['', Validators.required],
      } 
     );
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/LoaiVanBan/get-by-id/'+ row.loaivanbanid).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.loaivanban = res; 
          this.formdata = this.fb.group({
            
            'tenloaivanban': [this.loaivanban.tenloaivanban, Validators.required],
            'mota': [this.loaivanban.mota, Validators.required],  
          }
          ); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}