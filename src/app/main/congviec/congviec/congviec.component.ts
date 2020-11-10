import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-user',
  templateUrl: './congviec.component.html',
  styleUrls: ['./congviec.component.css'],
})
export class CongviecComponent extends BaseComponent implements OnInit {
  public Work: any;
  public works: any;
  public totalRecords:any;
  public pageSize = 2;
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
      'workname': [''],  
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/Work/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.Work = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/Work/search',{page: this.page, pageSize: this.pageSize, workname: this.formsearch.get('workname').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.Work = res.data;
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
           
           workname:value.workname,
           workdetails:value.workdetails,
           dateWorkstart:value.dateWorkstart,
           dateWorkend:value.dateWorkend,
           note:value.note        
          };
        this._api.post('/api/Work/create-work',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        
        let tmp = {
          workname:value.workname,
          workdetails:value.workdetails,
          dateWorkstart:value.dateWorkstart,
          dateWorkend:value.dateWorkend,
          note:value.note,
          workid:this.works.workid,          
          };
        this._api.post('/api/Work/update-work',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/Work/delete-work',{workid:row.workid}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.works = null;
    this.formdata = this.fb.group({
      'workname': ['', Validators.required],
      'workdetails': ['', Validators.required],
      'dateWorkstart': [this.today, Validators.required],
      'dateWorkend': [this.today, Validators.required],

      'note': [''],
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.works = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'workname': ['', Validators.required],
      'workdetails': ['', Validators.required],
      'dateWorkstart': [this.today, Validators.required],
      'dateWorkend': [this.today, Validators.required],
      'note': [''],
      } );
      this.formdata.get('dateWorkstart').setValue(this.today);
      this.formdata.get('dateWorkend').setValue(this.today);
      
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/Work/get-by-id/'+ row.workid).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.works = res; 
        let dateWorkstart = new Date(this.works.dateWorkstart);
        let dateWorkend = new Date(this.works.dateWorkend);
          this.formdata = this.fb.group({
            'workname': [this.works.workname, Validators.required],
            'workdetails': [this.works.workdetails, Validators.required],
            'dateWorkstart': [dateWorkstart, Validators.required],
            'dateWorkend': [dateWorkend, Validators.required],
            'note': [this.works.note, Validators.required],
            
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
