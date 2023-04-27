package com.repomon.rocketdan.domain.user.entity;


import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import lombok.*;

import javax.persistence.*;


@Entity
@Getter @Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "active_repo")
public class ActiveRepoEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "active_repo_id")
	private Long activeRepoId;

	private Boolean isActive;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private UserEntity user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "repo_id")
	private RepoEntity repo;

	public static ActiveRepoEntity of(UserEntity userEntity, RepoEntity repoEntity) {
		return ActiveRepoEntity.builder()
			.isActive(false)
			.user(userEntity)
			.repo(repoEntity)
			.build();
	}
}