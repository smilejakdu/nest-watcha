import {Test, TestingModule } from "@nestjs/testing";
import {UserRepository} from "../../database/repository/user.repository";
import {UsersService} from "../../service/users.service";
import bcrypt from "bcryptjs";
import {UsersEntity} from "../../database/entities/User/Users.entity";
import {LoginRequestDto} from "../../controller/users/users.controller.dto/logInDto/logIn.request.dto";
import { BoardsRepository } from "src/database/repository/BoardRepository/boards.repository";
import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";

describe('UserService', () => {
  let userService: UsersService;
  let userRepository: UserRepository;
  // 다른 필요한 의존성들 선언...
  let boardsRepository: BoardsRepository;
  let dataSource: DataSource;
  let configuService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserRepository,
        BoardsRepository,
        {
          provide: DataSource,
          useValue: {
            // 필요한 메소드를 여기서 목으로 구현하세요.
            // 예를 들어, DataSource가 'getData'라는 메소드를 가지고 있다면:
            // getData: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'test-secret';
                // 다른 키에 대한 처리
              }
            }),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    boardsRepository = module.get<BoardsRepository>(BoardsRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should login correctly', async () => {
    // 미리 정의된 User 객체
    const newUser = new UsersEntity();

    // userRepository의 findOneBy 메소드 mock
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(newUser);

    // bcrypt의 compare 메소드 mock
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    // logIn 함수를 실행하면 user 객체가 반환되는지 테스트
    const loginRequestDto = new LoginRequestDto();
    loginRequestDto.email = 'test@test.com';
    loginRequestDto.password = 'password';

    const result = await userService.logIn(loginRequestDto);

    // Check that the returned object has the properties 'accessToken' and 'user'
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('user');

    expect(result.user).toEqual(newUser);
  });
});
