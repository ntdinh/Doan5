import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-phongban',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class PhongbanComponent extends BaseComponent implements OnInit {
  public phongbans: any ;
  public PhongBan: any;
  public LoaiVanBan : any;
  public listvb: any ;
 public tenpb :any;
 public showUpdateModal1 :any;
  public totalRecords:any;
  public totalRecords_c:any;
  public pageSize = 3;
  public page = 1;
  public page_c = 1;
  public pageSize_c=3;
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
    // this.listvb =[{label:'Khác',value : 'Khác'}];
    // this._api.get('/api/PhongBan/get-all').takeUntil(this.unsubscribe).subscribe(res => {
    //   this.LoaiVanBan = res;
    //   console.log(res);
    //   this.LoaiVanBan.forEach(i =>{
    //     let tam = {label : 'Khác', value : 'Khác'};
        
    //     tam.label=i.tenloaivanban;
    //     tam.value = i.tenloaivanban;
       
    //     this.listvb.push(tam);
    //   });
    // });


    this.formsearch = this.fb.group({
      'tenphongban': [''],
      'loaivb':[''],  
    });
    

   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/PhongBan/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.PhongBan = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 
  
  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/PhongBan/search',{page: this.page, pageSize: this.pageSize, tenphongban: this.formsearch.get('tenphongban').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.PhongBan = res.data;
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
           
          tenphongban:value.tenphongban,
          ghichu:value.ghichu,
               
          };
        this._api.post('/api/PhongBan/create-phongban',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        
        let tmp = {
          tenphongban:value.tenphongban,
          ghichu:value.ghichu,
          phongbanid:this.phongbans.phongbanid,          
          };

        this._api.post('/api/PhongBan/update-phongban',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/PhongBan/delete-phongban',{phongbanid:row.phongbanid}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    //this.works = null;
    this.formdata = this.fb.group({
      'tenphongban': ['', Validators.required],
      'ghichu': ['', Validators.required],   
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.phongbans = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'tenphongban': ['', Validators.required],
      'ghichu': ['', Validators.required],
      
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
      this._api.get('/api/PhongBan/get-by-id/'+ row.phongbanid).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.phongbans = res; 
      //  let ngaybanhanh = new Date(this.phongbans.ngaybanhanh);
      //  let dateWorkend = new Date(this.vanbandi.dateWorkend);
          this.formdata = this.fb.group({
           // 'ngaybanhanh': [ngaybanhanh, Validators.required],
            'tenphongban': [this.phongbans.tenphongban, Validators.required],
            'ghichu': [this.phongbans.ghichu, Validators.required],
            
         
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  public  openDetail(item){
      let tam:any;
    let page = 1;
    this.tenpb = item;
    let pageSize = 2;
    this._api.post('/api/VanBanDi/get-all-phongban',{page:page,pageSize:pageSize,tenpb:item,loaivb:this.formsearch.get('loaivb').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.listvb = res;
      tam = res.totalItems;
      this.totalRecords_c =  res.totalItems;
      this.pageSize_c = res.pageSize;
      console.log(tam);
      
    });
    
  }
  public loadPage_c(page){
    this._api.post('/api/VanBanDi/get-all-phongban',{page:page,pageSize:this.pageSize_c,tenpb:this.tenpb}).takeUntil(this.unsubscribe).subscribe(res => {
      this.listvb = res;
      this.totalRecords_c =  res.totalItems;
      this.pageSize_c = res.pageSize;
      console.log(res);
      
    });
  }
  public openModalVB(row) {
    this.doneSetupForm = false;
    this.showUpdateModal1 = true; 
    this.formsearch = this.fb.group({
      // 'ngaybanhanh': [ngaybanhanh, Validators.required],
       'loaivb': ['', Validators.required],
       
       
    
     }); 
    //this.openDetail(row.tenphongban);
    let tam:any;
    let page = 1;
    this.tenpb = row.tenphongban;
    let pageSize = 2;
    
    this._api.post('/api/VanBanDi/get-all-phongban',{page:page,pageSize:pageSize,tenpb:this.tenpb,loaivb:this.formsearch.get('loaivb').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.listvb = res;
     
      this.totalRecords_c =  res.totalItems;
      this.pageSize_c = res.pageSize;
      
      if(this.totalRecords_c>0){
        setTimeout(() => {
          $('#createUserModal1').modal('toggle');
              this.doneSetupForm = true;
             
        }, 700);
        }
        else{
          alert("Không có văn bản nào !");
        }
    });
    
    
  }
  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
    $('#createUserModal1').closest('.modal').modal('hide');
  }
}
