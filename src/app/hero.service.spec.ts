import { inject, TestBed } from "@angular/core/testing"
import { HeroService } from "./hero.service"
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe('HeroService',()=>{

    let mockMessageService;
    let httpTestingController: HttpTestingController;
    let heroService: HeroService;



    beforeEach(()=>{

        mockMessageService = jasmine.createSpyObj(['add']);

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule // create mock http yesying module
            ],
            providers:[
                HeroService,
                {provide: MessageService, useValue: mockMessageService}
            ]
        });

        //httptestingcontroller control http
        //testbed.get is a way to get instance of your service module
        httpTestingController = TestBed.get(HttpTestingController);

        heroService = TestBed.get(HeroService);
    });

    describe('getHero',()=>{

        it("should call get with correct URL",
            inject([HeroService, HttpTestingController],
                (service:HeroService, controller:HttpTestingController) => {

                    service.getHero(4).subscribe();
                    const req = controller.expectOne('api/heroes/4');
                    req.flush({id:4, name:'SuperDude', strength:100});
                    controller.verify()

        }));

        //same test as above different way using testbed.get shorter then inject
        it("should call get with correct URL (simple)", () => {
            heroService.getHero(4).subscribe();
            const req = httpTestingController.expectOne('api/heroes/4');
            req.flush({id:4, name:'SuperDude', strength:100});
            httpTestingController.verify()
        });
    })
})