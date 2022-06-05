import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';
import { SuccessFulResponse } from './CoreResponse';

@Injectable()
export abstract class AbstractService {
	protected constructor(protected readonly repository: Repository<any>) {}

	async all(relations = []): Promise<any[]> {
		return this.repository.find({ relations });
	}

	async paginate(page = 1, relations = []): Promise<PaginatedResult> {
		const take = 15;

		const [data, total] = await this.repository.findAndCount({
			take,
			skip: (page - 1) * take,
			relations,
		});

		return {
			data: data,
			meta: {
				total,
				page,
				last_page: Math.ceil(total / take),
			},
		};
	}

	async create(data): Promise<any> {
		return this.repository.save(data);
	}

	async findOne(condition, relations: any = []): Promise<any> {
		const responseData = this.repository.findOne({
			where: condition,
			relations,
		});
		return SuccessFulResponse(responseData);
	}

	async update(id: number, data): Promise<any> {
		const updatedData = this.repository.update(id, data);
		return SuccessFulResponse(updatedData);
	}

	async delete(id: number): Promise<any> {
		const deletedData = this.repository.delete(id);
		return SuccessFulResponse(deletedData);
	}
}
