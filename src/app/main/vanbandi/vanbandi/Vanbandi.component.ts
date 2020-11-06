import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-vanbandi',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class VanbandiComponent extends BaseComponent implements OnInit {
  public vanbandis: any ;
  public VanBanDi: any;
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
      'noinhan': [''],  
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/VanBanDi/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.VanBanDi = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/VanBanDi/search',{page: this.page, pageSize: this.pageSize, noinhan: this.formsearch.get('noinhan').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.VanBanDi = res.data;
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
           
          ngaybanhanh:value.ngaybanhanh,
          loaivanbanid:value.loaivanbanid,
          noinhan:value.noinhan,
          noidung:value.noidung,
          user_id:value.user_id        
          };
        this._api.post('/api/VanBanDi/create-vanbandi',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        
        let tmp = {
          ngaybanhanh:value.ngaybanhanh,
          loaivanbanid:value.loaivanbanid,
          noinhan:value.noinhan,
          noidung:value.noidung,
          user_id:value.user_id,   
          vanbanid:this.vanbandis.vanbanid,          
          };
        this._api.post('/api/VanBanDi/update-vanbandi',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/VanBanDi/delete-vanbandi',{vanbanid:row.vanbanid}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    //this.works = null;
    this.formdata = this.fb.group({
      'ngaybanhanh': ['', Validators.required],
      'loaivanbanid': ['', Validators.required],
      'noinhan': [  Validators.required],
      'noidung': [ , Validators.required],
      'user_id': [,Validators.required],
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.vanbandis = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'ngaybanhanh': ['', Validators.required],
      'loaivanbanid': ['', Validators.required],
      'noinhan': [ '', Validators.required],
      'noidung': [ '', Validators.required],
      'user_id': ['',Validators.required],
      } );
     // this.formdata.get('dateWorkstart').setValue(this.today);
     // this.formdata.get('dateWorkend').setValue(this.today);
      
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/VanBanDi/get-by-id/'+ row.vanbanid).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.vanbandis = res; 
        let ngaybanhanh = new Date(this.vanbandis.ngaybanhanh);
      //  let dateWorkend = new Date(this.vanbandi.dateWorkend);
          this.formdata = this.fb.group({
            'ngaybanhanh': [ngaybanhanh, Validators.required],
            'loaivanbanid': [this.vanbandis.loaivanbanid, Validators.required],
            'noinhan': [this.vanbandis.noinhan, Validators.required],
            'noidung': [this.vanbandis.noidung, Validators.required],
            'user_id': [this.vanbandis.user_id, Validators.required],
            
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
