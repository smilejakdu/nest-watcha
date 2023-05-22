import {Test, TestingModule} from "@nestjs/testing";
import {UserRepository} from "../../database/repository/user.repository";
import {UsersService} from "../../service/users.service";
import bcrypt from "bcryptjs";
import {UsersEntity} from "../../database/entities/User/Users.entity";
import {LoginRequestDto} from "../../controller/users/users.controller.dto/logInDto/logIn.request.dto";
import {BoardsRepository} from "src/database/repository/BoardRepository/boards.repository";
import {DataSource} from "typeorm";
import {ConfigService} from "@nestjs/config";
import {SignUpRequestDto} from "src/controller/users/users.controller.dto/signUpDto/signUp.request.dto";
import {BadRequestException, HttpStatus} from "@nestjs/common";

describe('UserService', () => {
  let userService: UsersService;
  let userRepository: UserRepository;
  // 다른 필요한 의존성들 선언...
  let boardsRepository: BoardsRepository;
  let dataSource: DataSource;
  let configuService: ConfigService;

  const newUser = new UsersEntity();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserRepository,
        BoardsRepository,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                save: jest.fn().mockResolvedValue(newUser),
              },
            }),
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

  it('회원가입 검증', async () => {
    const newUser = new UsersEntity();

    // 이미 존재하는 이메일로 회원가입 시도
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(newUser);
    const existingEmailDto = new SignUpRequestDto();
    existingEmailDto.email = 'existing@test.com';
    existingEmailDto.password = 'password';
    await expect(userService.signUp(existingEmailDto)).rejects.toThrow(BadRequestException);

    // 비밀번호가 조건에 맞지 않을 경우
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
    const weakPasswordDto = new SignUpRequestDto();
    weakPasswordDto.email = 'new@test.com';
    weakPasswordDto.password = 'weak';
    await expect(userService.signUp(weakPasswordDto)).rejects.toThrow(BadRequestException);

    // 유효한 회원가입
    const signUpDto = new SignUpRequestDto();
    signUpDto.email = 'new@test.com';
    signUpDto.password = 'password123';

    userService['transactionRunner'] = jest.fn().mockImplementation(async (callback) => {
      const mockQueryRunner = {manager: {save: jest.fn().mockResolvedValue(newUser)}};
      return await callback(mockQueryRunner);
    }); // Assuming transactionRunner is a public or private method of userService

    const result = await userService.signUp(signUpDto);

    expect(result.data).toEqual(newUser);
  });

  it('로그인 검증', async () => {
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

  it('이메일로 게시판 리스트 찾기', async () => {
    // 가상의 유저 ID 생성
    const userId = 123;

    // 가짜 유저 객체 생성
    const fakeUser = { id: userId, email: 'example@example.com' };

    // 가짜 게시판 리스트 생성
    const fakeBoards = [
      { id: 1, title: '게시판 1' },
      { id: 2, title: '게시판 2' },
      { id: 3, title: '게시판 3' },
    ];

    // userRepository.findOneBy() 함수를 대체할 mock 함수 생성
    userRepository.findOneBy = jest.fn().mockResolvedValue(fakeUser);

    // boardRepository.findMyBoardByUserId() 함수를 대체할 mock 함수 생성
    boardsRepository.findMyBoardByUserId = jest.fn().mockResolvedValue(fakeBoards);

    // 함수 호출 및 결과 확인
    const result = await userService.findMyBoardsByEmail(userId);

    // userRepository.findOneBy() 함수가 주어진 userId로 호출되었는지 확인
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });

    // boardRepository.findMyBoardByUserId() 함수가 주어진 userId로 호출되었는지 확인
    expect(boardsRepository.findMyBoardByUserId).toHaveBeenCalledWith(userId);

    // 반환된 결과의 유저와 게시판 리스트가 예상과 일치하는지 확인
    expect(result).toEqual({
      ok: true,
      user: fakeUser,
      statusCode: HttpStatus.OK,
      myBoards: fakeBoards,
    });
  });
});
