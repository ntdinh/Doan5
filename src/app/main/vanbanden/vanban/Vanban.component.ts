import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-vanban',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class VanbanComponent extends BaseComponent implements OnInit {
  public menus: any ;
  public SO_VAN_BAN: any;
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
    this._api.get('/api/SoVanBan/get-all').takeUntil(this.unsubscribe).subscribe(data => {
      this.menus = data;
      console.log(data);
      
    }); 
  }

  loadPage(page) { 
    this._api.post('/api/SoVanBan/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.SO_VAN_BAN = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/SoVanBan/search',{page: this.page, pageSize: this.pageSize, ID_SO_VAN_BAN: this.formsearch.get('ID_SO_VAN_BAN').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.SO_VAN_BAN = res.data;
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
        let data_image = data == '' ? null : data;
        let tmp = {
           TEN_SO_VAN_BAN:value.TEN_SO_VAN_BAN,
           GHI_CHU:value.GHI_CHU,
                     
          };
        this._api.post('/api/SoVanBan/create-svb',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          TEN_SO_VAN_BAN:value.TEN_SO_VAN_BAN,
           GHI_CHU:value.GHI_CHU,
           ngaysinh:value.ngaysinh ,
           ID_SO_VAN_BAN:this.SO_VAN_BAN.ID_SO_VAN_BAN,          
          };
        this._api.post('/api/SoVanBan/update-svb',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/SoVanBan/delete-svb',{user_id:row.user_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.SO_VAN_BAN = null;
    this.formdata = this.fb.group({
      'TEN_SO_VAN_BAN': ['', Validators.required],
      'GHI_CHU': ['', Validators.required],
    } ); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.SO_VAN_BAN = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'TEN_SO_VAN_BAN': ['', Validators.required],
      'GHI_CHU': ['', Validators.required],
      });

      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/SO_VAN_BAN/get-by-id/'+ row.user_id).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.SO_VAN_BAN = res; 
          this.formdata = this.fb.group({
            'TEN_SO_VAN_BAN': ['', Validators.required],
             'GHI_CHU': ['', Validators.required],
          
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
