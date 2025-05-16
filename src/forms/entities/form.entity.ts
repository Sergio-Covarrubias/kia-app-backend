import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    AllowNull
} from 'sequelize-typescript';

import { User } from 'src/users/entities/user.entity';
import { Residue } from '@resources/residues/entities/residue.entity';
import { Container } from '@resources/containers/entities/container.entity';
import { Area } from '@resources/areas/entities/area.entity';
import { ProcessingStage } from '@resources/processing-stages/entities/processing-stage.entity';
import { Provider1 } from '@resources/providers1/entities/providers1.entity';
import { SctCode } from '@resources/sct-codes/entities/sct-code.entity';
import { Provider2 } from '@resources/providers2/entities/providers2.entity';
import { Manager } from '@resources/managers/entities/manager.entity';

@Table({ tableName: 'forms' })
export class Form extends Model {
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({ 
        type: DataType.INTEGER, 
        onDelete: 'CASCADE' 
    })
    user_id: number;

    @BelongsTo(() => User)
    user: User;
    
    @AllowNull(false)
    @ForeignKey(() => Residue)
    @Column({ 
        type: DataType.INTEGER, 
        onDelete: 'CASCADE' 
    })
    residue_id: number;

    @BelongsTo(() => Residue)
    residue: Residue;

    @AllowNull(false)
    @ForeignKey(() => Container)
    @Column({ 
        type: DataType.INTEGER, 
        onDelete: 'CASCADE' 
    })
    container_id: number;

    @BelongsTo(() => Container)
    container: Container;

    @AllowNull(false)
    @Column({
        type: DataType.FLOAT,
        validate: { min: 0.01 },
    })
    tons: number;

    @AllowNull(false)
    @ForeignKey(() => Area)
    @Column({ 
        type: DataType.INTEGER, 
        onDelete: 'CASCADE' 
    })
    area_id: number;

    @BelongsTo(() => Area)
    area: Area;

    @AllowNull(false)
    @Column({ type: DataType.DATEONLY })
    entry_date: Date;

    @Column({ type: DataType.DATEONLY })
    exit_date: Date | null;

    @AllowNull(false)
    @ForeignKey(() => ProcessingStage)
    @Column({ 
        type: DataType.INTEGER, 
        onDelete: 'CASCADE' 
    })
    processing_stage_id: number;

    @BelongsTo(() => ProcessingStage)
    processing_stage: ProcessingStage;

    @AllowNull(false)
    @ForeignKey(() => Provider1)
    @Column({ 
        type: DataType.INTEGER, 
        onDelete: 'CASCADE' 
    })
    provider_1_id: number;

    @BelongsTo(() => Provider1)
    provider_1: Provider1;

    @AllowNull(false)
    @ForeignKey(() => SctCode)
    @Column({ 
        type: DataType.INTEGER, 
        onDelete: 'CASCADE' 
    })
    sct_code_id: number;

    @BelongsTo(() => SctCode)
    sct_code: SctCode;

    @AllowNull(false)
    @ForeignKey(() => Provider2)
    @Column({ 
        type: DataType.INTEGER, 
        onDelete: 'CASCADE' 
    })
    provider_2_id: number;

    @BelongsTo(() => Provider2)
    provider_2: Provider2;

    @AllowNull(false)
    @ForeignKey(() => Manager)
    @Column({ 
        type: DataType.INTEGER, 
        onDelete: 'CASCADE' 
    })
    manager_id: number;

    @BelongsTo(() => Manager)
    manager: Manager;
}
