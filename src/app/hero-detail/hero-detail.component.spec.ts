import { Location } from "@angular/common";
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing"
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroDetailComponent } from "./hero-detail.component"

describe('HeroDetailComponent',()=>{

    let fixture : ComponentFixture<HeroDetailComponent>;
    let mockActivatedRoute, mockHeroService, mockLocation;

    beforeEach(()=>{
        mockActivatedRoute = {
            snapshot:{
                paramMap:{
                    get: () =>{
                        return '3';
                    }
                }
            }
        };

        mockHeroService = jasmine.createSpyObj(['getHero','updateHero']);

        mockLocation = jasmine.createSpyObj(['back']);

        TestBed.configureTestingModule({
            declarations: [HeroDetailComponent],
            providers: [
                {provide: ActivatedRoute , useValue: mockActivatedRoute},
                {provide: HeroService , useValue: mockHeroService},
                {provide: Location , useValue: mockLocation}
            ],
            imports: [
                FormsModule
            ]
        });

        fixture =  TestBed.createComponent(HeroDetailComponent);

        mockHeroService.getHero.and.returnValue(of({id:3, name: 'SuperDude', strength: 100}))

    });

    it('should render hero name in a h2 tag',()=>{
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE')
    });

    
    //async code test
    it('should call updateHero when save is called',(done)=>{

        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();

        //is not good to use lets say 10 test cases like this so we have to wait for 3 seconds
        setTimeout(()=>{
            expect(mockHeroService.updateHero).toHaveBeenCalled();
            done();
        },300);
        
    });

    //async code test
    it('should call updateHero when save is called (fakeasync)',fakeAsync(()=>{

        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();
        tick(250);

        //if we dont know in how much time the response will come use 'flush' instead of 'tick'
        //flush();

        expect(mockHeroService.updateHero).toHaveBeenCalled();
        
    }));

    //async code test for promise not for settimeout
    it('should call updateHero when save is called (async)',async(()=>{

        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();

        fixture.whenStable().then(()=>{
            expect(mockHeroService.updateHero).toHaveBeenCalled();
        })

        
    }));

})