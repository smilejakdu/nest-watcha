import {Test, TestingModule} from "@nestjs/testing";
import {UserRepository} from "../../src/database/repository/user.repository";
import {UsersService} from "../../src/service/users.service";
import bcrypt from "bcryptjs";
import {UsersEntity} from "../../src/database/entities/User/Users.entity";
import {BoardsRepository} from "src/database/repository/BoardRepository/boards.repository";
import {BadRequestException, HttpStatus} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {DataSource} from "typeorm";

describe('UserService', () => {
  let userService: UsersService;
  let userRepository: UserRepository;
  let boardsRepository: BoardsRepository;
  let mockDataSource;

  beforeEach(async () => {
    mockDataSource = {
      createQueryRunner: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserRepository,
        BoardsRepository,
        ConfigService,
        { provide: DataSource, useValue: mockDataSource }, // 변경된 부분
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    boardsRepository = module.get<BoardsRepository>(BoardsRepository);
  });

  describe('회원가입 검증', () => {
    it('이미 가입한 유저 입니다.', async () => {
      const signUpDto = {
        username:'newUser',
        email: 'newUser@gmail.com',
        password: 'Password123',
        phone:'21234',
      };

      const user = new UsersEntity();
      user.username = signUpDto.username;
      user.email = signUpDto.email;
      user.password = signUpDto.password;
      user.phone = signUpDto.phone;

      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      await expect(userService.signUp(signUpDto)).rejects.toThrow(BadRequestException);
      await expect(userService.signUp(signUpDto)).rejects.toThrow('이미 존재하는 이메일 입니다.');
    });

    it('비밀번호가 길이가 짧습니다.', async () => {
      const signUpDto = {
        username:'newUser',
        email: 'newUser@gmail.com',
        password: 'Pass',
        phone:'21234',
      };

      // 이메일이 존재하지 않음을 mock
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);

      // userService.signUp 호출 시 BadRequestException 예외가 발생하는 것을 검증합니다.
      await expect(userService.signUp(signUpDto)).rejects.toThrow(BadRequestException);

      // 예외 메시지까지 검증하려면 다음과 같이 합니다.
      await expect(userService.signUp(signUpDto)).rejects.toThrow(
        new BadRequestException('비밀번호는 숫자와 영문자를 포함하여 8자 이상이어야 합니다.')
      );
    });

    it('회원가입 성공', async () => {
      const newUser = new UsersEntity();
      newUser.username = 'newUser';
      newUser.email = 'ash@gmail.com';
      newUser.password = 'Password123';
      newUser.phone = '21234';

      // `findOneBy`가 null을 반환하도록 설정하여 회원가입이 가능하게 합니다.
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      // bcrypt.hash를 모의하여, 실제로 비밀번호 암호화 없이 모의 암호화된 값을 반환하도록 합니다.
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('encryptedPassword');

      mockDataSource.createQueryRunner.mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn().mockResolvedValue(newUser),
        }
      })

      const response = await userService.signUp(newUser);
      console.log('response:', response);
      expect(response.ok).toEqual(true);
      // 반환된 객체에서 비밀번호가 삭제되었는지 확인
      expect(response.data.password).toBeUndefined();

      // 반환값의 상태 코드가 201 (CREATED)인지 확인
      expect(response.statusCode).toBe(HttpStatus.CREATED);

      // 반환값의 사용자 정보에 email이 포함되어 있는지 확인
      expect(response.data.email).toBe(newUser.email);
    });
  })
});
